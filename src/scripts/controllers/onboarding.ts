// import { ObservableStore } from '@metamask/obs-store';
import log from 'loglevel';
// const ObservableStore = require('obs-store');

/**
 * @typedef {object} InitState
 * @property {boolean} seedPhraseBackedUp Indicates whether the user has completed the seed phrase backup challenge
 * @property {boolean} completedOnboarding Indicates whether the user has completed the onboarding flow
 */

/**
 * @typedef {object} OnboardingOptions
 * @property {InitState} initState The initial controller state
 */

/**
 * Controller responsible for maintaining
 * state related to onboarding
 */
export default class OnboardingController {
  store?: any;
  /**
   * Creates a new controller instance
   *
   * @param {OnboardingOptions} [opts] - Controller configuration parameters
   */
  constructor(opts: any = {}) {
    const initialTransientState = {
      onboardingTabs: {},
    };
    const initState = {
      seedPhraseBackedUp: null,
      firstTimeFlowType: null,
      completedOnboarding: false,
      ...opts.initState,
      ...initialTransientState,
    };
    // this.store = new ObservableStore({});
  }

  setSeedPhraseBackedUp(newSeedPhraseBackUpState: any) {
    this.store?.updateState({
      seedPhraseBackedUp: newSeedPhraseBackUpState,
    });
  }

  // /**
  //  * Sets the completedOnboarding state to true, indicating that the user has completed the
  //  * onboarding process.
  //  */
  completeOnboarding() {
    this.store?.updateState({
      completedOnboarding: true,
    });
    return Promise.resolve(true);
  }

  /**
   * Setter for the `firstTimeFlowType` property
   *
   * @param {string} type - Indicates the type of first time flow - create or import - the user wishes to follow
   */
  setFirstTimeFlowType(type: any) {
    this.store?.updateState({ firstTimeFlowType: type });
  }

  /**
   * Registering a site as having initiated onboarding
   *
   * @param {string} location - The location of the site registering
   * @param {string} tabId - The id of the tab registering
   */
  registerOnboarding = async (location: any, tabId: any) => {
    if (this.store?.getState().completedOnboarding) {
      log.debug('Ignoring registerOnboarding; user already onboarded');
      return;
    }
    const onboardingTabs = { ...this.store?.getState().onboardingTabs };
    if (!onboardingTabs[location] || onboardingTabs[location] !== tabId) {
      log.debug(`Registering onboarding tab at location '${location}' with tabId '${tabId}'`);
      onboardingTabs[location] = tabId;
      this.store?.updateState({ onboardingTabs });
    }
  };
}
