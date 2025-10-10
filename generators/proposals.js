const generatePTBCommand = ({ packageId, adminCapId, dashboardId, numProposals }) => {
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
  "@${adminCapId}" \`
  '"${title}"' '"${description}"' ${timestamp} \`
  --assign proposal_id \`
  --move-call ${packageId}::dashboard::register_proposal \`
  "@${dashboardId}" \`
  "@${adminCapId}" proposal_id`;
  }

  return command;
};

// Inputs
const inputs = {
  packageId: "0xb60aa226bc3125ed4b301a3b880bacf7d7388b5f27afdf2884eee5d1f6b837df",
  adminCapId: "0xf5264653964fff159926f433c164ced9377c7801305090a29143417fb8b0691f",
  dashboardId: "0x2eceda4826c71e48335bd1e742efe21cc62ab565662eede764c65f828abd6568",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
