import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SecurityComponent } from './security.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';

@NgModule({
  declarations: [SecurityComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ForgetpasswordComponent, // Add the standalone component here
  ],
  exports: [SecurityComponent],
})
export class SecurityModule {}
