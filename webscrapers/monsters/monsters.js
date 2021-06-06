const puppeteer = require('puppeteer');
const keys = require('../config/keys.js');
const fs = require('fs');
const { Client } = require('pg');

const writeToProd = true;
const fetchDataFromSRD = false;
const jsonFileName = 'monsters1622842869754';

const jsonFilePath = fetchDataFromSRD
  ? `json/monsters${Date.now()}.json`
  : `json/${jsonFileName}.json`;

(async function fetchMonsters() {
  if (fetchDataFromSRD) {
  }
  // start puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);

  if (fetchDataFromSRD) {
    try {
      // list of monster objects we will add to database
      const monstersToAdd = [];

      // Get all mosnter links from SRD20 3.5
      await page.goto('https://www.d20srd.org/indexes/monsters.htm');
      const monsterLinks = await page.$$eval('.column li a', (links) => {
        links = links.map((el) => el.href);
        // remove links with anchor tags
        links = links.filter((link) => !link.includes('#'));
        return links;
      });

      // loop through each monster link and find each monster's stats

      for (link of monsterLinks) {
        let newPage = await browser.newPage();
        newPage.setDefaultNavigationTimeout(0);
        console.log(`Visiting monsters at link ${link}...`);
        await newPage.goto(link);

        // get all stat blocks
        const monsterObjects = await newPage.$$eval(
          'table.statBlock',
          (statBlocks) => {
            let monsters = [];

            // helper function
            const formatStatName = (str) => {
              // remove : and / from string
              str = str.replace(':', '');
              str = str.replace('/', '');
              str = str.replace(' ', '');
              // split string up by whitespace if there are any
              str = str.toLowerCase();
              return str;
            };

            // check if current stat block has more than one monster in it
            statBlocks = statBlocks.map((statBlock) => {
              let numOfMonstersInStatBlock =
                statBlock.querySelectorAll('.colHead th').length;
              // fill monster object with stats
              for (let i = 1; i < numOfMonstersInStatBlock; i++) {
                let monsterObject = {};
                monsterObject['name'] = statBlock
                  .querySelectorAll('tr.colHead th')
                  [i].textContent.trim();
                monsterObject['srd20href'] = window.location.href;
                const stats = statBlock.querySelectorAll('tr:not(.colHead) th');
                for (stat of stats) {
                  let statName = formatStatName(stat.textContent);
                  let statValue = stat.parentNode.children[i];
                  if (statValue) {
                    monsterObject[statName] = statValue.textContent;
                  }
                }
                monsters.push(monsterObject);
              }
              // check for no header statBlocks
              if (numOfMonstersInStatBlock === 0) {
                let monsterObject = {};
                monsterObject['name'] =
                  statBlock.previousElementSibling.textContent.trim();
                monsterObject['srd20href'] = window.location.href;
                const stats = statBlock.querySelectorAll('tr:not(.colHead) th');
                for (stat of stats) {
                  let statName = formatStatName(stat.textContent);
                  let statValue = stat.parentNode.children[1];
                  if (statValue) {
                    monsterObject[statName] = statValue.textContent;
                  }
                }
                monsters.push(monsterObject);
              }
            });
            return monsters;
          }
        );
        monstersToAdd.push(...monsterObjects);
        // add monsters from current link to json file
        // check if file exists
        if (fs.existsSync(jsonFilePath)) {
          //file exists
          fs.readFile(jsonFilePath, function (err, data) {
            let json = JSON.parse(data);
            json.push(...monsterObjects);
            fs.writeFile(
              jsonFilePath,
              JSON.stringify(json),
              function (err, data) {
                if (err) console.log('Error in adding monsters to JSON file');
              }
            );
          });
        } else {
          fs.writeFile(
            jsonFilePath,
            JSON.stringify(monstersToAdd),
            function (err, data) {
              if (err) console.log('Error in adding monsters to JSON file');
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      await browser.close();
    }
  }

  // Add monsters found to database
  let client;
  if (writeToProd) {
    client = new Client({
      connectionString: keys.PG_CONNECTION.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  } else {
    client = new Client({
      user: keys.PG_CONNECTION.USER,
      host: keys.PG_CONNECTION.HOST,
      database: keys.PG_CONNECTION.DATABASE,
      password: keys.PG_CONNECTION.PASSWORD,
      port: keys.PG_CONNECTION.PORT,
    });
  }
  try {
    // connect to database
    await client.connect();
    let json;
    if (fs.existsSync(jsonFilePath)) {
      //file exists
      json = JSON.parse(fs.readFileSync(jsonFilePath));
    }

    const values = [JSON.stringify(json)];
    const res = await client.query(
      'INSERT INTO dnd35graph.monster(name, srd20Href, sizeType, hitDice, initiative, speed, armorClass, baseAttackGrapple, attack, fullAttack, spaceReach, specialAttacks, specialQualities, saves, abilities, skills, feats, environment, organization, challengeRating, treasure, alignment, advancement, levelAdjustment) SELECT name, srd20Href, sizeType, hitDice, initiative, speed, armorClass, baseAttackGrapple, attack, fullAttack, spaceReach, specialAttacks, specialQualities, saves, abilities, skills, feats, environment, organization, challengeRating, treasure, alignment, advancement, levelAdjustment FROM json_to_recordset($1) AS x(name text, srd20Href text, sizeType text, hitDice text, initiative text, speed text, armorClass text, baseAttackGrapple text, attack text, fullAttack text, spaceReach text, specialAttacks text, specialQualities text, saves text, abilities text, skills text, feats text, environment text, organization text, challengeRating text, treasure text, alignment text, advancement text, levelAdjustment text);',
      values
    );
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
})();
