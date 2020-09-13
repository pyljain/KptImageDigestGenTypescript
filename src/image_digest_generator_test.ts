import { Configs, TestRunner } from 'kpt-functions';
import { imageDigestGenerator } from './image_digest_generator';

const RUNNER = new TestRunner(imageDigestGenerator);

describe('imageDigestGenerator', () => {
  it('does something', async () => {
    // TODO: Populate the input to the function.
    const input = new Configs();

    // TODO: Populate the expected output of the function.
    const expectedOutput = new Configs();

    await RUNNER.assert(input, expectedOutput);
  });
});
