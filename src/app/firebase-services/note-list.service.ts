import { Injectable, inject } from '@angular/core';
import { collectionData, Firestore, collection, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  nornmalNotes: Note[] = [];  

  items$;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(this.getNormalRef());
  }

  //const itemCollection = collection(this.firestore, 'items');

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNormalRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);

  }
}
