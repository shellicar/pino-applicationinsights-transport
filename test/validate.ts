import { verify } from 'testdouble';

export const validate = async <D>(mock: () => D) => {
  await new Promise<void>(process.nextTick);
  await new Promise<void>(process.nextTick);
  verify(mock());
};
