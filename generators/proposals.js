const generatePTBCommand = ({ packageId, dashboardId, numProposals }) => {
  let command = "sui client ptb `";

  for (let i = 1; i <= numProposals; i++) {
    // Generate timestamp: current date + 1 year + incremental seconds
    const currentDate = new Date();
    const oneYearFromNow = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
    const timestamp = oneYearFromNow.getTime() + i; // Add 1 second per proposal
    const timestampId = Math.floor(Math.random() * 100000 * i);

    const title = `Proposal ${timestampId}`;
    const description = `Proposal description ${timestampId}`;

    // Add proposal creation command (Windows-style)
    command += `
  --move-call ${packageId}::proposal::create \`
  '"${title}"' '"${description}"' ${timestamp} \`
  --assign proposal_id \`
  --move-call ${packageId}::dashboard::register_proposal \`
  "@${dashboardId}" proposal_id`;
  }

  return command;
};

// Inputs
const inputs = {
  packageId: "0xcd62e598668be6609359a72e7e7b06ffd1126add22cadb4fda240cb3688f25b0",
  dashboardId: "0x28eedce6d37d7a1bfc199377ffe83da735870266d7a68859822afd534e2ed57c",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
