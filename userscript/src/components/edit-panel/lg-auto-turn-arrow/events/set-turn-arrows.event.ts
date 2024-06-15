interface SetTurnArrowsEventDetails {
  associatedButton: HTMLButtonElement;
}
export class SetTurnArrowsEvent extends CustomEvent<SetTurnArrowsEventDetails> {
  constructor(detail: SetTurnArrowsEventDetails) {
    super('setturnarrows', {
      bubbles: false,
      cancelable: false,
      detail,
    });

    Object.defineProperties(this, {
      target: {
        value: detail.associatedButton,
      },
      currentTarget: {
        value: detail.associatedButton,
      },
    });
  }
}
