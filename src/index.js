const github = require('@actions/github');
const core = require('@actions/core');
const slackSend = require('./slack-github-action/src/slack-send');

function generatePayload() {
  const repo_url = `${github.context.serverUrl}/${github.repo.owner}/${github.repo.repo}`;
  const shart_short = github.context.sha.substring(0,7);

  const job_status = process.env.JOB_STATUS;
  let status_readable = job_status;
  if (job_status == 'success') {
    status_readable = "succeeded";
  } else if (job_status == "failure") {
    status_readable = "failed";
  }

  let detail = "";
  detail += `*Ref*: ${github.context.ref}\n`;
  detail += `*Workflow*: ${github.context.workflow}\n`;
  detail += `*Job*: ${github.context.job}\n`;
  detail += `*Event*: ${github.context.eventName}\n`;
  detail += `*Actions URL*: ${repo_url}/actions/runs/${github.context.runId}\n`;

  return {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Workflow ${status_readable}.`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": detail
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "image",
            "image_url": "https://raw.githubusercontent.com/kyontan/slack-notify-action/main/icons/GitHub-Mark-32px.png",
            "alt_text": "github icon"
          },
          {
            "type": "image",
            "image_url": `https://raw.githubusercontent.com/kyontan/slack-notify-action/main/icons/${github.context.job.status}.png`,
            "alt_text": "status icon"
          },
          {
            "type": "mrkdwn",
            "text": `Commit: <${repo_url}/commit/${shart_short}|${shart_short}>`
          }
        ]
      }
    ]
  }
}

let coreWrapper = {
  getInput: function(key) {
    if (key == "payload") {
      return generatePayload();
    }
    if (key == "payload-file-path") {
      return null;
    }
    if (key == "slack-message") {
      return null;
    }
    if (key == "channel-id") {
      return core.getInput(key);
    }
  },
  setOutput: core.setOutput,
  setFailed: core.setFailed,
}

const onceExecuted = core.getState("onceExecuted");

if (onceExecuted == "") {
  core.saveState("onceExecuted", "true");
  core.info('This is not post run, skip notification');
} else {
  core.info('This is post run, sending notification');
  slackSend(coreWrapper);
}
