const { Client } = require('@notionhq/client');
const { Octokit } = require('@octokit/core');
const { config } = require('dotenv');

config();

const notionPageId = process.env.NOTION_PAGE_ID;
const notionApiKey = process.env.NOTION_API_KEY;
const ghAuthToken = process.env.GH_AUTH_TOKEN;
const myGhHandle = process.env.MY_GH_HANDLE;
const repo = process.env.REPO_NAME;

const notion = new Client({ auth: notionApiKey });
const octokit = new Octokit({ auth: ghAuthToken });

async function getUsersToInvite() {
  const columnName = 'GH Handle';

  try {
    const res = await notion.databases.query({
      database_id: notionPageId,
    });

    // can this be moved to the query itself?
    return res.results.map(
      prop => prop.properties[columnName].rich_text[0].plain_text
    );
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

async function getRepoCollaborators() {
  try {
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/collaborators',
      {
        owner: myGhHandle,
        repo,
      }
    );

    return res.data.map(user => user.login);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

async function addUserAsCollaborator(username) {
  try {
    const res = await octokit.request(
      'PUT /repos/{owner}/{repo}/collaborators/{username}',
      {
        owner: myGhHandle,
        repo,
        username,
      }
    );

    if (res.status === 201) {
      console.log(`✅ ${username} was sent an invite to collaborate!`);
    }
  } catch (error) {
    if (error.status === 404) {
      console.log(
        `❌ User ${username} was not found and could not be added as a Collaborator`
      );
    } else {
      console.log('ERROR: ', error.data.message);
    }
  }
}

async function findAndAddMissingRepoCollaborators() {
  const usersToInvite = await getUsersToInvite();
  const repoCollaborators = await getRepoCollaborators();

  const missingForkCollaborators = usersToInvite.filter(
    user => !repoCollaborators.includes(user)
  );

  for (const username of missingForkCollaborators) {
    await addUserAsCollaborator(username);
  }
}

findAndAddMissingRepoCollaborators();
