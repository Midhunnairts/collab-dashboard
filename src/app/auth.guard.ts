import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }

  constructor(private router: Router) {}
}
