interface rules {
  max: number,
  value: number
}

// ----DEF MOD RESULTS---- //
// -----400 = 7
// -----351-400 = 6
// -----275-350 = 5
// -----201-274 = 4
// -----151-200 = 3
// -----100-150 = 2
// ----<100 =  0
export const defenseRules : rules[] = [
  {max: 100, value: 0},
  {max: 150, value: 2},
  {max: 200, value: 3},
  {max: 275, value: 4},
  {max: 350, value: 5},
  {max: 400, value: 6},
  {max: Infinity, value: 7},
];