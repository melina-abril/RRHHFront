import { initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';

let instance: Auth | null = null;

/** Firebase Auth del proyecto (una sola instancia; con authEmulatorUrl, contra el emulador). En modo mock no se usa. */
export function firebaseAuth(): Auth {
  if (!instance) {
    instance = getAuth(initializeApp(environment.firebase));
    if (environment.authEmulatorUrl) connectAuthEmulator(instance, environment.authEmulatorUrl, { disableWarnings: true });
  }
  return instance;
}
