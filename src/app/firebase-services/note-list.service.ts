import { Injectable, inject } from '@angular/core';
import { collectionData, query, orderBy, limit, where, Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];  
  normalMarkedNotes: Note[] = [];


  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
 

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
  }


  ngonDestroy(){
    this.unsubNotes();
    this.unsubMarkedNotes();
    this.unsubTrash();
  }
  

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) =>{
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subNotesList() {
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) =>{
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (list) =>{
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  async updateNote(note: Note){
    if(note.id){
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.error(err) }
      );
    }
  }


  getCleanJson(note: Note) {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }


  getColIdFromNote(note:Note) {
    if(note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }


  async addNote(item: Note, colId: "notes" | "trash" = "notes") {
    let collectionRef;
    if (colId === "trash") {
      collectionRef = this.getTrashRef(); // Stellen Sie sicher, dass diese Methode die richtige Referenz zurückgibt
    } else {
      collectionRef = this.getNotesRef();
    }
  
    await addDoc(collectionRef, item).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => { console.log("Document written with id: ", docRef?.id) }
    );
  }


  getTrashRef() {
     return collection(this.firestore, 'trash');
   }


  getNotesRef() {
     return collection(this.firestore, 'notes');
   }


  setNoteObject(obj: any, id: string) : Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }


  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }


  async deleteNote(colId: "notes" | "trash", docId:string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => { console.error(err) }
    );
  }
}
