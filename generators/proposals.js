const generatePTBCommand = ({ packageId, dashboardId, numProposals }) => {
  let command = "sui client ptb `";
  const blodID = "OLvelm89IHWIvUuJ2vj4-Mxn7qEBTiRy8WFy_xNRbSQ";

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
  '"${title}"' '"${description}"' ${timestamp} '"${blodID}"' \`
  --assign proposal_id \`
  --move-call ${packageId}::dashboard::register_proposal \`
  "@${dashboardId}" proposal_id`;
  }

  return command;
};

// Inputs
const inputs = {
  packageId: "0x23967e1d9d0be10cec5148506cb378caf14a638177c1176e28effee27b0694f6",
  dashboardId: "0xe491203dd967078c122e1ab82e5071482718d3935a3def3f1cf5b4ab17030e61",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);

