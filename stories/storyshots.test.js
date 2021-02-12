/* eslint-disable import/no-extraneous-dependencies */
import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

window.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor() {}

  // eslint-disable-next-line class-methods-use-this
  disconnect() {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  observe() {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  takeRecords() {
    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  unobserve() {
    return null;
  }
};

initStoryshots({
  test: snapshotWithOptions({
    createNodeMock: () => ({}),
  }),
});
