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
  packageId: "0x7caae6c44345c4b21300730f7e298b70c487f6c6874de085d4081f66c69156e2",
  adminCapId: "0xee24e1565d80bebadcaefc3e9eed24179d4faa83ed2a6e5c76deb9f4f3983f07",
  dashboardId: "0xff3bc732ae5c5a8cececfcdf6023a7d1a69b67348f9abc72cd903b35b03d784e",
  numProposals: 3, // số lượng proposal cần tạo
};

// Generate the command
const ptbCommand = generatePTBCommand(inputs);
console.log(ptbCommand);
