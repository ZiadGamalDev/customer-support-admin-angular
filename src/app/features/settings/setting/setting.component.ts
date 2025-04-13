import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { SecurityComponent } from '../security/security.component';
import { AgentSidebarComponent } from '../../sidebar/agent-sidebar/agent-sidebar.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';


@Component({
  selector: 'app-setting',
  imports: [
    RouterModule,
    ProfileComponent,
    SecurityComponent,
    AgentSidebarComponent,
    EditProfileComponent,

  ],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css',
})
export class SettingComponent {}
