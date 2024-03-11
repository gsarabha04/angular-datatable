import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { personsData } from '../constants/persons-static-data';
import { Person } from '../models/person';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
// import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  persons$: BehaviorSubject<Person[]>;
  persons: Array<Person> = [];
  changeVar:any = [];
  apiServerUrl = "http://localhost:8080/api/v1/medicalResearch";
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file
  constructor(private http:HttpClient) {
    this.persons$ = new BehaviorSubject([]);
    this.changeVar = this.persons$.asObservable();
    this.persons = [];

  }

   async getAll(){
    const programApi = `${this.apiServerUrl}/participants/participants?researchCode=1`;
    const data = await this.http.get(programApi).toPromise().then((jsonData) => {
      console.log(jsonData);
         this.persons = jsonData;
       })
    this.persons$.next(this.persons);

  }
  onChange(event) {
         this.file = event.target.files[0];
     }
  onUpload() {
        this.loading = !this.loading;
        console.log(this.file);
        this.upload(this.file).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {

                    // Short link via api response
                    this.shortLink = event.link;

                    this.loading = false; // Flag variable
                }
            }
        );
      }

      upload(file):Observable<any> {

          // Create form data
          const formData = new FormData();

          // Store form name as "file" with file data
          formData.append("file", file, file.name);

          // Make http post request over api
          // with formData as req
          return this.http.post(this.baseApiUrl, formData)
   }


  add(person: Person) {
    let findElem = {};
    const programApi = `${this.apiServerUrl}/participants/addParticipants/1`;

    findElem.firstName = person.firstName;
    findElem.lastName = person.lastName;
    findElem.dob = person.dob;
    findElem.address = person.address;
    findElem.city = person.city;
    findElem.state = person.state;
    findElem.phone = person.phone;
    findElem.email = person.email;
    findElem.profilePic = person.profilePic;
    findElem.description = person.description;
    this.http.post<any>(programApi, findElem)
        .subscribe();

    this.persons$.next(this.persons);
    location.reload();
  }

  edit(person: Person) {
    let findElem = this.persons.find(p => p.id == person.id);
    const programApi = `${this.apiServerUrl}/participants/updateparticipants/`;

    findElem.firstName = person.firstName;
    findElem.lastName = person.lastName;
    findElem.dob = person.dob;
    findElem.address = person.address;
    findElem.city = person.city;
    findElem.state = person.state;
    findElem.phone = person.phone;
    findElem.email = person.email;
    findElem.profilePic = person.profilePic;
    findElem.description = person.description;
    this.http.put<any>(programApi+person.id, findElem)
        .subscribe();

    this.persons$.next(this.persons);
  }

  remove(id: number) {

    this.persons = this.persons.filter(p => {
      return p.id != id
    });
    const programApi = `${this.apiServerUrl}/participants/employee/`;
    this.http.delete(programApi+id)
    .subscribe(() => this.status = 'Delete successful');
    this.persons$.next(this.persons);
  }

}
