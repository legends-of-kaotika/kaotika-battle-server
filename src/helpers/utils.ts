
// Prints a console.log() unless the code is being executed in testing enviroment 
export const logUnlessTesting = (message: string) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(message);
  }
};
