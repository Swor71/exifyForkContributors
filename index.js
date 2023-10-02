const { Client, LogLevel } = require('@notionhq/client');
const { Octokit } = require('@octokit/core');
const { config } = require('dotenv');

config();

const notionPageId = process.env.NOTION_PAGE_ID;
const notionApiKey = process.env.NOTION_API_KEY;
const ghAuthToken = process.env.GH_AUTH_TOKEN;

const notion = new Client({ auth: notionApiKey, logLevel: LogLevel.DEBUG });
const octokit = new Octokit({ auth: ghAuthToken });

const columnName = 'GH Handle';

async function querryNotionDatabase() {
  try {
    // const res = await notion.databases.query({
    //   database_id: notionPageId,
    // });
    // console.log(
    //   'RESULT: ',
    //   res.results.map(
    //     (prop) => prop.properties[columnName].rich_text[0].plain_text
    //   )
    // );
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

async function getRepoCollaborators() {
  // await octokit.request('GET /repos/{owner}/{repo}/collaborators/{username}', {
  //   owner: 'swor71',
  //   repo: 'App',
  //   username: 'USERNAME',
  //   headers: {
  //     'X-GitHub-Api-Version': '2022-11-28',
  //   },
  // });

  try {
    const res = await octokit.request(
      'GET /repos/{owner}/{repo}/collaborators',
      {
        owner: 'swor71',
        repo: 'App',
        // headers: {
        //   'X-GitHub-Api-Version': '2022-11-28'
        // }
      }
    );

    console.log('gh res', res);
  } catch (error) {
    console.log('ERROR: ', error);
  }
}

getRepoCollaborators();

// querryNotionDatabase();
