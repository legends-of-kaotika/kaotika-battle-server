const cron = require('node-cron');

const diseases = [
  { name: "PUTRID PLAGUE", effect: { attribute: "intelligence", percentageEffect: -0.75 }, diseaseName: "putridPlague" }, // -75%
  { name: "EPIC WEAKNESS", effect: { attribute: "strength", percentageEffect: -0.6 }, diseaseName: "epicWeakness" },      // -60%
  { name: "MEDULAR APOCALYPSE", effect: { attribute: "constitution", percentageEffect: -0.3 }, diseaseName: "medularApocalypse" } // -30%
];

const applyEffect = () => {
  console.log('\x1b[33m Normal Effect applied! \x1b[0m\n');

};

const applyRandomEffect = () => {
  const disease = diseases[Math.floor(Math.random() * diseases.length)];
  console.log(`\x1b[31m User affected by ${disease.name} \x1b[0m\n`);

};

const startCronJob = () => {
  cron.schedule('*/10 * * * * * ', async () => {

    console.log("\n\x1b[37m Running Cron Job: Applying Effects & Applying Diseases \x1b[0m\n")

    try {

      applyEffect();

      if (Math.random() < 0.3) {
        applyRandomEffect();
      }
      console.log('\x1b[32m Cron Completed Successfully! \n');

    } catch (error) {
      console.error("Error in Cron Job:", error);
    }
  });

  console.log("Cron Job Initialized\n");

};

module.exports = { startCronJob };
