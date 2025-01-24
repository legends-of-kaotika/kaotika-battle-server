const cron = require('node-cron');

const diseases = [
  { name: "PUTRID PLAGUE", effect: { attribute: "intelligence", percentageEffect: -0.75 }, diseaseName: "putridPlague" }, // -75%
  { name: "EPIC WEAKNESS", effect: { attribute: "strength", percentageEffect: -0.6 }, diseaseName: "epicWeakness" },      // -60%
  { name: "MEDULAR APOCALYPSE", effect: { attribute: "constitution", percentageEffect: -0.3 }, diseaseName: "medularApocalypse" } // -30%
];

const applyEffect = () => {
  console.log("Effect applied");

};

const applyRandomEffect = () => {
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    console.log(`User affected by ${disease.name}`);
};

const startCronJob = () => {
  cron.schedule('*/10 * * * * * ', async () => {
    console.log("Running Cron Job: Applying Effects");

    try {

      applyEffect();

      if (Math.random() < 0.3) {
        applyRandomEffect();
      }
      console.log("Cron Completed Successfully");
    } catch (error) {
      console.error("Error in Cron Job:", error);
    }
  });

  console.log("Cron Job Initialized");
};

module.exports = { startCronJob };
