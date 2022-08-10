import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";

const auth = getAuth();

// Fire and forget.  Subscribe to onAuthStateChanged for results.
export const emailLogin =  (email: string, password: string) => {

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('emailLogin success', userCredential)
  })
  .catch((error) => {
    console.log('emailLogin', error)
    // const errorCode = error.code;
    // const errorMessage = error.message;
  });
}

export const emailRegister =  (email: string, password: string, repeatedPassword: string) => {

}

export const googleLogin = () => {};

export const logout = () => {
  auth.signOut()
};
