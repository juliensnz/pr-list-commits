const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    const token = core.getInput("repo-token");
    const { owner, repo } = github.context.repo;

    const prNumber = getPrNumber();

    if (!prNumber) {
      core.setFailed("Could not get pull request number from context");
    }

    const octokit = new github.GitHub(token);

    const response = await octokit.pulls.listCommits({
      owner: owner,
      repo: repo,
      pull_number: prNumber
    });

    console.log(response);

    core.setOutput("commits", response);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

function getPrNumber() {
  const pullRequest = github.context.payload.pull_request;

  if (!pullRequest) {
    return undefined;
  }

  return pullRequest.number;
}

run();
