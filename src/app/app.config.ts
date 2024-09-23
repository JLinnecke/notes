import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers:
  [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-68a3c","appId":"1:248709517966:web:dea16e921e929e9851efdf","storageBucket":"danotes-68a3c.appspot.com","apiKey":"AIzaSyAVPo8vEyYkGA_dkJjqdJCpDWlkwI-9Xls","authDomain":"danotes-68a3c.firebaseapp.com","messagingSenderId":"248709517966"}))),
  importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-68a3c","appId":"1:248709517966:web:dea16e921e929e9851efdf","storageBucket":"danotes-68a3c.appspot.com","apiKey":"AIzaSyAVPo8vEyYkGA_dkJjqdJCpDWlkwI-9Xls","authDomain":"danotes-68a3c.firebaseapp.com","messagingSenderId":"248709517966"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
