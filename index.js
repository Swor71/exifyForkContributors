const { Client, LogLevel } = require('@notionhq/client');
const { Octokit } = require('@octokit/core');
const { config } = require('dotenv');

config();

const notionPageId = process.env.NOTION_PAGE_ID;
const notionApiKey = process.env.NOTION_API_KEY;
const ghAuthToken = process.env.GH_AUTH_TOKEN;
const myGhHandle = process.env.MY_GH_HANDLE;
const repoName = process.env.REPO_NAME;

const notion = new Client({ auth: notionApiKey, logLevel: LogLevel.DEBUG });
const octokit = new Octokit({ auth: ghAuthToken });

async function getUsersToInvite() {
  const columnName = 'GH Handle';

  try {
    const res = await notion.databases.query({
      database_id: notionPageId,
    });

    return res.results.map(
      (prop) => prop.properties[columnName].rich_text[0].plain_text
    );
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

// first approach is to use the api to check if the user is a collaborator and if not in the error catch add them
// async function checkIfUserIsCollaborator(username) {
//   try {
//     const res = await octokit.request(
//       'GET /repos/{owner}/{repo}/collaborators/{username}',
//       {
//         owner: myGhHandle,
//         repo: repoName,
//         username,
//       }
//     );

//     console.log(checkIfUserIsCollaborator.name, res);
//   } catch (error) {
//     // if error -> user not a collaborator -> add here? kinda weird
//     console.log('ERROR: ', error);

//     return false;
//   }
// }

// different approach of comparing locally having two arrays
async function getRepoCollaborators() {
  try {
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/collaborators',
      {
        owner: myGhHandle,
        repo: repoName,
      }
    );

    return res.data.map((user) => user.login);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

async function addUserAsCollaborator() {
  const usersToInvite = await getUsersToInvite();
  const repoCollaborators = await getRepoCollaborators();

  const missingForkCollaborators = usersToInvite.filter(
    (user) => !repoCollaborators.includes(user)
  );

  console.log(addUserAsCollaborator.name, {
    usersToInvite,
    repoCollaborators,
    missingForkCollaborators,
  });

  // for (username of missingForkCollaborators) {
  //   await checkIfUserIsCollaborator(username);
  // }
}

addUserAsCollaborator();
