import { KubernetesObject } from 'kpt-functions';
import * as apiCoreV1 from './io.k8s.api.core.v1';
import * as apisMetaV1 from './io.k8s.apimachinery.pkg.apis.meta.v1';

// CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object.
export class CSINode implements KubernetesObject {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // metadata.name must be the Kubernetes node name.
  public metadata: apisMetaV1.ObjectMeta;

  // spec is the specification of CSINode
  public spec: CSINodeSpec;

  constructor(desc: CSINode.Interface) {
    this.apiVersion = CSINode.apiVersion;
    this.kind = CSINode.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
  }
}

export function isCSINode(o: any): o is CSINode {
  return o && o.apiVersion === CSINode.apiVersion && o.kind === CSINode.kind;
}

export namespace CSINode {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "CSINode";

  // CSINode holds information about all CSI drivers installed on a node. CSI drivers do not need to create the CSINode object directly. As long as they use the node-driver-registrar sidecar container, the kubelet will automatically populate the CSINode object for the CSI driver as part of kubelet plugin registration. CSINode has the same name as a node. If the object is missing, it means either there are no CSI Drivers available on the node, or the Kubelet version is low enough that it doesn't create this object. CSINode has an OwnerReference that points to the corresponding node object.
  export interface Interface {
    // metadata.name must be the Kubernetes node name.
    metadata: apisMetaV1.ObjectMeta;

    // spec is the specification of CSINode
    spec: CSINodeSpec;
  }
}

// CSINodeDriver holds information about the specification of one CSI driver installed on a node
export class CSINodeDriver {
  // allocatable represents the volume resources of a node that are available for scheduling. This field is beta.
  public allocatable?: VolumeNodeResources;

  // This is the name of the CSI driver that this object refers to. This MUST be the same name returned by the CSI GetPluginName() call for that driver.
  public name: string;

  // nodeID of the node from the driver point of view. This field enables Kubernetes to communicate with storage systems that do not share the same nomenclature for nodes. For example, Kubernetes may refer to a given node as "node1", but the storage system may refer to the same node as "nodeA". When Kubernetes issues a command to the storage system to attach a volume to a specific node, it can use this field to refer to the node name using the ID that the storage system will understand, e.g. "nodeA" instead of "node1". This field is required.
  public nodeID: string;

  // topologyKeys is the list of keys supported by the driver. When a driver is initialized on a cluster, it provides a set of topology keys that it understands (e.g. "company.com/zone", "company.com/region"). When a driver is initialized on a node, it provides the same topology keys along with values. Kubelet will expose these topology keys as labels on its own node object. When Kubernetes does topology aware provisioning, it can use this list to determine which labels it should retrieve from the node object and pass back to the driver. It is possible for different nodes to use different topology keys. This can be empty if driver does not support topology.
  public topologyKeys?: string[];

  constructor(desc: CSINodeDriver) {
    this.allocatable = desc.allocatable;
    this.name = desc.name;
    this.nodeID = desc.nodeID;
    this.topologyKeys = desc.topologyKeys;
  }
}

// CSINodeList is a collection of CSINode objects.
export class CSINodeList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // items is the list of CSINode
  public items: CSINode[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata?: apisMetaV1.ListMeta;

  constructor(desc: CSINodeList) {
    this.apiVersion = CSINodeList.apiVersion;
    this.items = desc.items.map((i) => new CSINode(i));
    this.kind = CSINodeList.kind;
    this.metadata = desc.metadata;
  }
}

export function isCSINodeList(o: any): o is CSINodeList {
  return o && o.apiVersion === CSINodeList.apiVersion && o.kind === CSINodeList.kind;
}

export namespace CSINodeList {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "CSINodeList";

  // CSINodeList is a collection of CSINode objects.
  export interface Interface {
    // items is the list of CSINode
    items: CSINode[];

    // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata?: apisMetaV1.ListMeta;
  }
}

// CSINodeSpec holds information about the specification of all CSI drivers installed on a node
export class CSINodeSpec {
  // drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty.
  public drivers: CSINodeDriver[];

  constructor(desc: CSINodeSpec) {
    this.drivers = desc.drivers;
  }
}

// StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.
// 
// StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.
export class StorageClass implements KubernetesObject {
  // AllowVolumeExpansion shows whether the storage class allow volume expand
  public allowVolumeExpansion?: boolean;

  // Restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature.
  public allowedTopologies?: apiCoreV1.TopologySelectorTerm[];

  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata: apisMetaV1.ObjectMeta;

  // Dynamically provisioned PersistentVolumes of this storage class are created with these mountOptions, e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid.
  public mountOptions?: string[];

  // Parameters holds the parameters for the provisioner that should create volumes of this storage class.
  public parameters?: {[key: string]: string};

  // Provisioner indicates the type of the provisioner.
  public provisioner: string;

  // Dynamically provisioned PersistentVolumes of this storage class are created with this reclaimPolicy. Defaults to Delete.
  public reclaimPolicy?: string;

  // VolumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature.
  public volumeBindingMode?: string;

  constructor(desc: StorageClass.Interface) {
    this.allowVolumeExpansion = desc.allowVolumeExpansion;
    this.allowedTopologies = desc.allowedTopologies;
    this.apiVersion = StorageClass.apiVersion;
    this.kind = StorageClass.kind;
    this.metadata = desc.metadata;
    this.mountOptions = desc.mountOptions;
    this.parameters = desc.parameters;
    this.provisioner = desc.provisioner;
    this.reclaimPolicy = desc.reclaimPolicy;
    this.volumeBindingMode = desc.volumeBindingMode;
  }
}

export function isStorageClass(o: any): o is StorageClass {
  return o && o.apiVersion === StorageClass.apiVersion && o.kind === StorageClass.kind;
}

export namespace StorageClass {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "StorageClass";

  // StorageClass describes the parameters for a class of storage for which PersistentVolumes can be dynamically provisioned.
  // 
  // StorageClasses are non-namespaced; the name of the storage class according to etcd is in ObjectMeta.Name.
  export interface Interface {
    // AllowVolumeExpansion shows whether the storage class allow volume expand
    allowVolumeExpansion?: boolean;

    // Restrict the node topologies where volumes can be dynamically provisioned. Each volume plugin defines its own supported topology specifications. An empty TopologySelectorTerm list means there is no topology restriction. This field is only honored by servers that enable the VolumeScheduling feature.
    allowedTopologies?: apiCoreV1.TopologySelectorTerm[];

    // Standard object's metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata: apisMetaV1.ObjectMeta;

    // Dynamically provisioned PersistentVolumes of this storage class are created with these mountOptions, e.g. ["ro", "soft"]. Not validated - mount of the PVs will simply fail if one is invalid.
    mountOptions?: string[];

    // Parameters holds the parameters for the provisioner that should create volumes of this storage class.
    parameters?: {[key: string]: string};

    // Provisioner indicates the type of the provisioner.
    provisioner: string;

    // Dynamically provisioned PersistentVolumes of this storage class are created with this reclaimPolicy. Defaults to Delete.
    reclaimPolicy?: string;

    // VolumeBindingMode indicates how PersistentVolumeClaims should be provisioned and bound.  When unset, VolumeBindingImmediate is used. This field is only honored by servers that enable the VolumeScheduling feature.
    volumeBindingMode?: string;
  }
}

// StorageClassList is a collection of storage classes.
export class StorageClassList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Items is the list of StorageClasses
  public items: StorageClass[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata?: apisMetaV1.ListMeta;

  constructor(desc: StorageClassList) {
    this.apiVersion = StorageClassList.apiVersion;
    this.items = desc.items.map((i) => new StorageClass(i));
    this.kind = StorageClassList.kind;
    this.metadata = desc.metadata;
  }
}

export function isStorageClassList(o: any): o is StorageClassList {
  return o && o.apiVersion === StorageClassList.apiVersion && o.kind === StorageClassList.kind;
}

export namespace StorageClassList {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "StorageClassList";

  // StorageClassList is a collection of storage classes.
  export interface Interface {
    // Items is the list of StorageClasses
    items: StorageClass[];

    // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata?: apisMetaV1.ListMeta;
  }
}

// VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node.
// 
// VolumeAttachment objects are non-namespaced.
export class VolumeAttachment implements KubernetesObject {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata: apisMetaV1.ObjectMeta;

  // Specification of the desired attach/detach volume behavior. Populated by the Kubernetes system.
  public spec: VolumeAttachmentSpec;

  // Status of the VolumeAttachment request. Populated by the entity completing the attach or detach operation, i.e. the external-attacher.
  public status?: VolumeAttachmentStatus;

  constructor(desc: VolumeAttachment.Interface) {
    this.apiVersion = VolumeAttachment.apiVersion;
    this.kind = VolumeAttachment.kind;
    this.metadata = desc.metadata;
    this.spec = desc.spec;
    this.status = desc.status;
  }
}

export function isVolumeAttachment(o: any): o is VolumeAttachment {
  return o && o.apiVersion === VolumeAttachment.apiVersion && o.kind === VolumeAttachment.kind;
}

export namespace VolumeAttachment {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "VolumeAttachment";

  // VolumeAttachment captures the intent to attach or detach the specified volume to/from the specified node.
  // 
  // VolumeAttachment objects are non-namespaced.
  export interface Interface {
    // Standard object metadata. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata: apisMetaV1.ObjectMeta;

    // Specification of the desired attach/detach volume behavior. Populated by the Kubernetes system.
    spec: VolumeAttachmentSpec;

    // Status of the VolumeAttachment request. Populated by the entity completing the attach or detach operation, i.e. the external-attacher.
    status?: VolumeAttachmentStatus;
  }
}

// VolumeAttachmentList is a collection of VolumeAttachment objects.
export class VolumeAttachmentList {
  // APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
  public apiVersion: string;

  // Items is the list of VolumeAttachments
  public items: VolumeAttachment[];

  // Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
  public kind: string;

  // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
  public metadata?: apisMetaV1.ListMeta;

  constructor(desc: VolumeAttachmentList) {
    this.apiVersion = VolumeAttachmentList.apiVersion;
    this.items = desc.items.map((i) => new VolumeAttachment(i));
    this.kind = VolumeAttachmentList.kind;
    this.metadata = desc.metadata;
  }
}

export function isVolumeAttachmentList(o: any): o is VolumeAttachmentList {
  return o && o.apiVersion === VolumeAttachmentList.apiVersion && o.kind === VolumeAttachmentList.kind;
}

export namespace VolumeAttachmentList {
  export const apiVersion = "storage.k8s.io/v1";
  export const group = "storage.k8s.io";
  export const version = "v1";
  export const kind = "VolumeAttachmentList";

  // VolumeAttachmentList is a collection of VolumeAttachment objects.
  export interface Interface {
    // Items is the list of VolumeAttachments
    items: VolumeAttachment[];

    // Standard list metadata More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata
    metadata?: apisMetaV1.ListMeta;
  }
}

// VolumeAttachmentSource represents a volume that should be attached. Right now only PersistenVolumes can be attached via external attacher, in future we may allow also inline volumes in pods. Exactly one member can be set.
export class VolumeAttachmentSource {
  // inlineVolumeSpec contains all the information necessary to attach a persistent volume defined by a pod's inline VolumeSource. This field is populated only for the CSIMigration feature. It contains translated fields from a pod's inline VolumeSource to a PersistentVolumeSpec. This field is alpha-level and is only honored by servers that enabled the CSIMigration feature.
  public inlineVolumeSpec?: apiCoreV1.PersistentVolumeSpec;

  // Name of the persistent volume to attach.
  public persistentVolumeName?: string;
}

// VolumeAttachmentSpec is the specification of a VolumeAttachment request.
export class VolumeAttachmentSpec {
  // Attacher indicates the name of the volume driver that MUST handle this request. This is the name returned by GetPluginName().
  public attacher: string;

  // The node that the volume should be attached to.
  public nodeName: string;

  // Source represents the volume that should be attached.
  public source: VolumeAttachmentSource;

  constructor(desc: VolumeAttachmentSpec) {
    this.attacher = desc.attacher;
    this.nodeName = desc.nodeName;
    this.source = desc.source;
  }
}

// VolumeAttachmentStatus is the status of a VolumeAttachment request.
export class VolumeAttachmentStatus {
  // The last error encountered during attach operation, if any. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.
  public attachError?: VolumeError;

  // Indicates the volume is successfully attached. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.
  public attached: boolean;

  // Upon successful attach, this field is populated with any information returned by the attach operation that must be passed into subsequent WaitForAttach or Mount calls. This field must only be set by the entity completing the attach operation, i.e. the external-attacher.
  public attachmentMetadata?: {[key: string]: string};

  // The last error encountered during detach operation, if any. This field must only be set by the entity completing the detach operation, i.e. the external-attacher.
  public detachError?: VolumeError;

  constructor(desc: VolumeAttachmentStatus) {
    this.attachError = desc.attachError;
    this.attached = desc.attached;
    this.attachmentMetadata = desc.attachmentMetadata;
    this.detachError = desc.detachError;
  }
}

// VolumeError captures an error encountered during a volume operation.
export class VolumeError {
  // String detailing the error encountered during Attach or Detach operation. This string may be logged, so it should not contain sensitive information.
  public message?: string;

  // Time the error was encountered.
  public time?: apisMetaV1.Time;
}

// VolumeNodeResources is a set of resource limits for scheduling of volumes.
export class VolumeNodeResources {
  // Maximum number of unique volumes managed by the CSI driver that can be used on a node. A volume that is both attached and mounted on a node is considered to be used once, not twice. The same rule applies for a unique volume that is shared among multiple pods on the same node. If this field is not specified, then the supported number of volumes on this node is unbounded.
  public count?: number;
}