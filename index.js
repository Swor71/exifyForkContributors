const { Client } = require('@notionhq/client');
const { config } = require('dotenv');

config();

const pageId = process.env.NOTION_PAGE_ID;
const apiKey = process.env.NOTION_API_KEY;

const notion = new Client({ auth: apiKey });

const columnName = 'GH Handle';

const querryDatabase = async () => {
  try {
    const res = await notion.databases.query({
      database_id: pageId,
    });

    console.log(
      'RESULT: ',
      res.results.map(
        (prop) => prop.properties[columnName].rich_text[0].plain_text
      )
    );
  } catch (error) {
    console.log('ERROR: ', error);
  }
};

querryDatabase();

// const BASE_URL = 'https://api.notion.com';
