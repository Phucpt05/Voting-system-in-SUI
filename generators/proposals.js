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
  packageId: "0x05f3d6fdc1a2a48aa870798300f1f66b33b315547efd1137251b0c73ad15389b",
  adminCapId: "0x692c4cc9f7a23187803df6d0ffcc7612e9e7d46a3799c64a9b8725a258df199e",
  dashboardId: "0x1ad26e3bbb6b30f8c26a986edc4140fa5341e5a24d1176d3b1bf1a7d0e23bd66",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
