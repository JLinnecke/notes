import { Injectable, inject } from '@angular/core';
import { collectionData, Firestore, collection, doc, onSnapshot, addDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];  


  unsubTrash;
  unsubNotes;
 

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }


  ngonDestroy(){
    this.unsubNotes();
    this.unsubTrash();
  }
  

  subTrashList() {
    return onSnapshot(this.getNotesRef(), (list) =>{
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subNotesList() {
    return onSnapshot(this.getTrashRef(), (list) =>{
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  async updateNote(note: Note){
    if(note.id){
      await updateDoc(this.getSingleDocRef(colId, note.id),item).catch(
        (err) => { console.error(err) }
      );
    }
  }


  getColIdFromNote(note:Note) {
    if(note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }


  async addNote(item: Note){
    await addDoc(this.getNotesRef(), item).catch(
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
}
