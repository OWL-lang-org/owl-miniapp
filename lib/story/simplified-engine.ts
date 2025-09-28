import { StoryNode, owlStory, findStoryNode } from './simplified-story';

export type Output =
  | { kind: 'message'; text: string }
  | { kind: 'image'; src: string; alt?: string }
  | { kind: 'video'; src: string; autoplay?: boolean; interactive?: boolean }
  | { kind: 'fade'; to?: string; direction?: 'in' | 'out' }
  | { kind: 'notification'; text: string }
  | { kind: 'feature'; name: 'maps' | 'notes' | 'menu'; enabled: boolean }
  | { kind: 'attestation'; id?: string }
  | { kind: 'unknown'; raw: string };

export interface Choice {
  label: string;
  to: string;
  key: string;
}

export interface StoryState {
  currentKey: string;
  stack: string[];
  userProgress?: {
    attestations?: string[];
    choices?: Record<string, number>;
    completedNodes?: string[];
  };
}

export interface StepResult {
  state: StoryState;
  outputs: Output[];
  choices: Choice[];
}

export class SimplifiedStoryEngine {
  private startNodeId: string;

  constructor() {
    this.startNodeId = 'f73a4b1f-1c1c-45be-89d9-08ef256cfec9';
  }

  init(): StepResult {
    const initState: StoryState = { 
      currentKey: this.startNodeId, 
      stack: [],
      userProgress: {
        attestations: [],
        choices: {},
        completedNodes: []
      }
    };
    return this.materialize(initState);
  }

  loadState(currentKey: string, userProgress?: StoryState['userProgress']): StepResult {
    const state: StoryState = {
      currentKey,
      stack: [],
      userProgress: userProgress || {
        attestations: [],
        choices: {},
        completedNodes: []
      }
    };
    return this.materialize(state);
  }

  step(state: StoryState, choice: string): StepResult {
    const currentNode = findStoryNode(state.currentKey);
    if (!currentNode) {
      throw new Error(`Node not found: ${state.currentKey}`);
    }

    let nextNodeId: string | undefined;

    if (currentNode.choices) {
      const choiceIndex = currentNode.choices.findIndex(c => c.text === choice);
      if (choiceIndex >= 0) {
        nextNodeId = currentNode.choices[choiceIndex].nextNodeId;
        
        
        if (state.userProgress) {
          state.userProgress.choices = state.userProgress.choices || {};
          state.userProgress.choices[state.currentKey] = choiceIndex;
        }
      }
    }

    if (!nextNodeId) {
      throw new Error(`No next node found for choice: ${choice}`);
    }

    const newState: StoryState = {
      currentKey: nextNodeId,
      stack: [...state.stack, state.currentKey],
      userProgress: state.userProgress
    };

    return this.materialize(newState);
  }

  private materialize(state: StoryState): StepResult {
    let currentNodeId = state.currentKey;
    const outputs: Output[] = [];
    const visitedNodes: string[] = [];

    while (currentNodeId) {
      const node = findStoryNode(currentNodeId);
      if (!node || visitedNodes.includes(currentNodeId)) {
        break;
      }

      visitedNodes.push(currentNodeId);

      outputs.push(...this.nodeToOutputs(node));

      if (state.userProgress) {
        state.userProgress.completedNodes = state.userProgress.completedNodes || [];
        if (!state.userProgress.completedNodes.includes(currentNodeId)) {
          state.userProgress.completedNodes.push(currentNodeId);
        }

        if (node.content.attestation && state.userProgress.attestations) {
          state.userProgress.attestations.push(currentNodeId);
        }
      }

      if (node.autoAdvance) {
        currentNodeId = node.autoAdvance;
      } else {
        break;
      }
    }

    const finalNode = findStoryNode(currentNodeId);
    const choices = this.getChoicesFromNode(finalNode);

    const newState: StoryState = {
      currentKey: currentNodeId,
      stack: state.stack,
      userProgress: state.userProgress
    };

    return { state: newState, outputs, choices };
  }

  private nodeToOutputs(node: StoryNode): Output[] {
    const outputs: Output[] = [];

    if (node.content.messages) {
      for (const message of node.content.messages) {
        outputs.push({ kind: 'message', text: message });
      }
    }

    if (node.content.image) {
      outputs.push({ 
        kind: 'image', 
        src: node.content.image, 
        alt: node.title || node.content.image 
      });
    }

    if (node.content.video) {
      outputs.push({ 
        kind: 'video', 
        src: node.content.video, 
        autoplay: true,
        interactive: node.content.interactive || false
      });
    }

    if (node.content.notification) {
      outputs.push({ kind: 'notification', text: node.content.notification });
    }

    if (node.content.fade) {
      outputs.push({ 
        kind: 'fade', 
        direction: node.content.fade.direction,
        to: node.content.fade.to
      });
    }

    if (node.content.features) {
      for (const feature of node.content.features) {
        outputs.push({ 
          kind: 'feature', 
          name: feature.name, 
          enabled: feature.enabled 
        });
      }
    }

    if (node.content.attestation) {
      outputs.push({ kind: 'attestation', id: node.id });
    }

    return outputs;
  }

  private getChoicesFromNode(node: StoryNode | undefined): Choice[] {
    if (!node || !node.choices) {
      return [];
    }

    return node.choices.map((choice, index) => ({
      label: choice.text,
      to: choice.nextNodeId,
      key: `choice-${index}`
    }));
  }

  getCurrentNode(state: StoryState): StoryNode | undefined {
    return findStoryNode(state.currentKey);
  }

  hasUserMadeAttestation(state: StoryState, nodeId: string): boolean {
    return state.userProgress?.attestations?.includes(nodeId) || false;
  }

  getUserChoiceForNode(state: StoryState, nodeId: string): number | undefined {
    return state.userProgress?.choices?.[nodeId];
  }

  getCompletedNodes(state: StoryState): string[] {
    return state.userProgress?.completedNodes || [];
  }

  getProgressPercentage(state: StoryState): number {
    const totalNodes = owlStory.length;
    const completedNodes = this.getCompletedNodes(state).length;
    return Math.round((completedNodes / totalNodes) * 100);
  }

  getAttestationCount(state: StoryState): number {
    return state.userProgress?.attestations?.length || 0;
  }
}
