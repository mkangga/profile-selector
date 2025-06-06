/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- DOM Elements ---
let profileSelectorMain: HTMLDivElement | null;
let pinEntryScreen: HTMLDivElement | null;
let profileContentScreen: HTMLDivElement | null;
let pinInput: HTMLInputElement | null;
let pinScreenTitle: HTMLElement | null;
let pinErrorMessage: HTMLElement | null;
let profileWelcomeMessage: HTMLElement | null;

// --- State ---
let currentProfile: string | null = null;
const PROFILE_PINS: Record<string, string> = {
  MKA: "1234",
  B: "5678",
  C: "9101",
  D: "1121",
  E: "3141",
};

/**
 * Hides all main screen views.
 */
function hideAllScreens(): void {
  profileSelectorMain?.classList.add('hidden');
  pinEntryScreen?.classList.add('hidden');
  profileContentScreen?.classList.add('hidden');
}

/**
 * Shows the main profile selector screen.
 */
function showProfileSelector(): void {
  hideAllScreens();
  profileSelectorMain?.classList.remove('hidden');
  currentProfile = null;
}

/**
 * Shows the PIN entry screen for the given profile.
 * @param profileName The name of the profile requiring PIN.
 */
function showPinScreen(profileName: string): void {
  hideAllScreens();
  pinEntryScreen?.classList.remove('hidden');
  currentProfile = profileName;

  if (pinScreenTitle) {
    pinScreenTitle.textContent = `Enter PIN for ${profileName}`;
  }
  if (pinInput) {
    pinInput.value = ''; // Clear previous PIN
    pinInput.focus();
  }
  if (pinErrorMessage) {
    pinErrorMessage.textContent = ''; // Clear previous error
  }
}

/**
 * Handles the PIN submission.
 */
function handlePinSubmit(): void {
  if (!currentProfile || !pinInput || !pinErrorMessage) return;

  const enteredPin = pinInput.value;
  const correctPin = PROFILE_PINS[currentProfile];

  if (correctPin && enteredPin === correctPin) {
    showProfilePage(currentProfile);
  } else if (correctPin) {
    pinErrorMessage.textContent = 'Incorrect PIN. Please try again.';
    pinInput.value = '';
    pinInput.focus();
  } else {
    // This case should ideally not be reached if PIN screen is only shown for profiles in PROFILE_PINS
    // However, as a fallback, we can show the profile page.
    console.warn(`Profile ${currentProfile} does not have a PIN defined but PIN screen was shown. Proceeding to profile page.`);
    showProfilePage(currentProfile);
  }
}

/**
 * Shows the profile content page for the given profile.
 * @param profileName The name of the profile.
 */
function showProfilePage(profileName: string): void {
  hideAllScreens();
  profileContentScreen?.classList.remove('hidden');
  currentProfile = profileName; // Ensure currentProfile is set

  if (profileWelcomeMessage) {
    profileWelcomeMessage.textContent = `Welcome, ${profileName}!`;
  }
   // In a real app, you would load profile-specific content here
  console.log(`Navigated to ${profileName}'s page.`);
}


/**
 * Initializes the application, sets up event listeners.
 */
function init(): void {
  console.log("Profile selector app initialized.");

  // Cache DOM elements
  profileSelectorMain = document.getElementById('profile-selector-main') as HTMLDivElement;
  pinEntryScreen = document.getElementById('pin-entry-screen') as HTMLDivElement;
  profileContentScreen = document.getElementById('profile-content-screen') as HTMLDivElement;
  pinInput = document.getElementById('pin-input') as HTMLInputElement;
  pinScreenTitle = document.getElementById('pin-screen-title');
  pinErrorMessage = document.getElementById('pin-error-message');
  profileWelcomeMessage = document.getElementById('profile-welcome-message');

  const profileCards = document.querySelectorAll<HTMLDivElement>('.profile-card');
  profileCards.forEach(card => {
    const profileName = card.dataset.profileName;
    if (!profileName) return;

    const selectProfile = () => {
        console.log(`${profileName} selected.`);
        if (PROFILE_PINS[profileName]) {
            showPinScreen(profileName);
        } else {
            // This else block might become redundant if all profiles eventually have PINs
            // or if we decide profiles without PINs go directly to their page.
            showProfilePage(profileName);
        }
    };

    card.addEventListener('click', selectProfile);
    card.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        selectProfile();
      }
    });
  });

  const manageButton = document.querySelector<HTMLButtonElement>('.manage-profile-button');
  if (manageButton) {
    manageButton.addEventListener('click', () => {
      console.log('Manage Profile button clicked.');
      // Add navigation or modal display here for managing profiles
    });
  }

  // PIN Screen listeners
  const pinSubmitButton = document.getElementById('pin-submit-button');
  pinSubmitButton?.addEventListener('click', handlePinSubmit);

  pinInput?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handlePinSubmit();
    }
  });


  const pinCancelButton = document.getElementById('pin-cancel-button');
  pinCancelButton?.addEventListener('click', showProfileSelector);

  // Profile Content Screen listener
  const backToProfilesButton = document.getElementById('back-to-profiles-button');
  backToProfilesButton?.addEventListener('click', showProfileSelector);

  // Initial setup
  showProfileSelector(); // Start with the profile selector screen
}

// Ensure the DOM is fully loaded before running the init function.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init(); // DOMContentLoaded has already fired
}
