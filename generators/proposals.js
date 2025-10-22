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
  packageId: "0xe6f457e4cce09f7c09cf396760f78a6fd23866e1d7ef9b50414c62923a475ebf",
  dashboardId: "0xb430ff30026d69bd5fe6106f8486a5c635cc478867075f64aa108950dbe75cbd",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
