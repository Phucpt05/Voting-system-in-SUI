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
  packageId: "0x73fcf7f7a3219a85db9ceacbf848e6f0f0c7bfb58f5164da0e9f0f0c95c08d47",
  adminCapId: "0xbc8f2381b3f488cf90d405380e6214de4e11c338e516d96662ba4681dd76f51d",
  dashboardId: "0xddd6bd5a85bd288ef8c6209175fa56059e0e5ddc61bfa2400189636f0a5bf42e",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
