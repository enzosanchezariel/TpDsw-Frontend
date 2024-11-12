export class User {
    public token_id: number;
    public dni: string;
    public name: string;
    public last_name: string;
    public email: string;
    public phone: string;
    public address: string;
    public password: string;
    public role: string;
  
    constructor(
      token_id: number,
      dni: string,
      name: string,
      last_name: string,
      email: string,
      phone: string,
      address: string,
      password: string,
      role: string,
    ) {
      this.token_id = token_id;
      this.dni = dni;
      this.name = name;
      this.last_name = last_name;
      this.email = email;
      this.phone = phone;
      this.address = address;
      this.password = password;
      this.role = role;
    }
  }