import { Configs } from "kpt-functions";
import { isDeployment, isStatefulSet } from "./gen/io.k8s.api.apps.v1";
import { isPod, PodSpec } from "./gen/io.k8s.api.core.v1";
import fetch from "node-fetch";

export async function imageDigestGenerator(configs: Configs) {
  let promises: Array<Promise<void>> = [];

  promises = promises.concat(
    configs.get(isPod).map((pod) => modifyImage(pod.spec!)),
  );

  promises = promises.concat(
    configs.get(isDeployment).map((deploy) =>
      modifyImage(deploy.spec!.template!.spec!)
    ),
  );

  promises = promises.concat(
    configs.get(isStatefulSet).map((ss) =>
      modifyImage(ss.spec!.template!.spec!)
    ),
  );

  await Promise.all(promises);
}

async function modifyImage(podSpec: PodSpec): Promise<void> {
  let promises: Array<Promise<string>> = [];

  promises = podSpec!.containers.map((container) =>
    async function (): Promise<string> {
      let image = container!.image;
      const imageFragments = image?.split(":");
      if (!image?.includes("sha256")) {
        const imageRepo = imageFragments![0];
        const imageTag = imageFragments![1] || "latest";
        if (imageRepo) {
          const repositoryFragments = imageRepo.split("/");
          const repositoryLocation = repositoryFragments![0];
          const url = createDockerRegistryV2URL(
            repositoryLocation,
            repositoryFragments.slice(1).join("/"),
            imageTag,
          );

          const res = await fetch(url);
          const resJSON = await res.json();
          const digest = resJSON!.config!.digest;

          return `${imageRepo}@${digest}`;
        }
      }

      return "";
    }()
  );

  const imagesToUpdate = await Promise.all(promises);

  // Mutate container images
  podSpec!.containers.forEach((container, index) => {
    container!.image! = imagesToUpdate[index];
  });
}

function createDockerRegistryV2URL(
  url: string,
  imageName: string,
  tag: string,
): string {
  return `https://${url}/v2/${imageName}/manifests/${tag}`;
}

imageDigestGenerator.usage = `
TODO: Describe what the function does.

TODO: Describe how to configure the function.

TODO: Provide an example configuration.
`;
