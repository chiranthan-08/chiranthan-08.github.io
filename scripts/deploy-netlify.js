/**
 * Automated Production Deployment Script for Netlify
 * Directly publishes latest changes to https://myportfolio-2145.netlify.app
 * Bypasses CI credit limits by deploying pre-built assets and activating them.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');

const SITE_ID = 'a17e4c60-47d6-4885-957d-a583bed6d5bd';
const SITE_URL = 'https://myportfolio-2145.netlify.app';

function getNetlifyToken() {
  if (process.env.NETLIFY_AUTH_TOKEN) {
    return process.env.NETLIFY_AUTH_TOKEN;
  }
  const configPath = path.join(os.homedir(), 'AppData', 'Roaming', 'netlify', 'Config', 'config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const userId = config.userId;
    if (config.users && config.users[userId] && config.users[userId].auth) {
      return config.users[userId].auth.token;
    }
  }
  return null;
}

function restoreDeploy(siteId, deployId, token) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.netlify.com',
      path: `/api/v1/sites/${siteId}/deploys/${deployId}/restore`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Auto-Deployer'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('🚀 Starting Netlify Production Deployment...');
  const token = getNetlifyToken();
  if (!token) {
    console.error('❌ Could not find Netlify authentication token. Run `npx netlify-cli login` first.');
    process.exit(1);
  }

  const projectDir = path.resolve(__dirname, '..');
  console.log(`📁 Project Directory: ${projectDir}`);

  console.log('📦 Uploading static assets to Netlify...');
  let deployOutput;
  try {
    deployOutput = execSync('npx netlify-cli deploy --dir . --json', {
      cwd: projectDir,
      shell: 'cmd.exe',
      maxBuffer: 20 * 1024 * 1024,
      encoding: 'utf8'
    });
  } catch (err) {
    console.error('❌ Netlify asset upload failed:', err.message);
    if (err.stdout) console.log(err.stdout.toString());
    process.exit(1);
  }

  let deployResult;
  try {
    deployResult = JSON.parse(deployOutput);
  } catch (e) {
    const match = deployOutput.match(/\{[\s\S]*"deploy_id"[\s\S]*\}/);
    if (match) {
      deployResult = JSON.parse(match[0]);
    } else {
      console.error('❌ Failed to parse Netlify deploy output:', deployOutput);
      process.exit(1);
    }
  }

  const deployId = deployResult.deploy_id || deployResult.id;
  console.log(`✅ Assets successfully uploaded! Deploy ID: ${deployId}`);

  console.log('🔄 Activating deploy to Production URL...');
  const restoreRes = await restoreDeploy(SITE_ID, deployId, token);

  if (restoreRes.status === 200) {
    console.log('\n======================================================');
    console.log('🎉 SUCCESS! Portfolio successfully published to Netlify!');
    console.log(`🌐 Live URL: ${SITE_URL}`);
    console.log(`🆔 Deploy ID: ${deployId}`);
    console.log('======================================================\n');
  } else {
    console.error('❌ Activation failed with status:', restoreRes.status, restoreRes.data);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal deployment error:', err);
  process.exit(1);
});
