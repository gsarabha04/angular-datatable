export class Person {
  id?: number;
  researchCode?: number;
  firstName: string;
  lastName: string;
  dob: date;
  address: string;
  addressLine2: string;
  zipCode: string;
  description: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  profilePic: string;

  constructor( firstName: string = '',description: string = '',lastName: string = '', dob: date = '', address: string = '',addressLine2: string = '',zipCode: string = '',city: string = '',state: string = '',phone: string = '',email: string = '',profilePic: string = '') {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dob = dob;
    this.address = address;
    this.addressLine2 = address;
    this.zipCode = zipCode;
    this.city = city;
    this.state = state;
    this.phone = phone;
    this.email = email;
    this.description = description;
    this.profilePic = profilePic;
  }
}
