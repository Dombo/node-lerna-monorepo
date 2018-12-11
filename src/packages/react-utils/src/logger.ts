export const logger = (message: string) => {
  if (process.env.NODE_ENV === 'development') console.log(message);
}