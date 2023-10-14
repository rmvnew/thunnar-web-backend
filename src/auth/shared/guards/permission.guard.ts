import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { isArray } from 'class-validator';

export function PermissionGuard(permission: any): Type<CanActivate> {
  class PermissionGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<any>();
      const profile: string = request?.user?.profile; // O perfil do usuário é um UUID

      console.log('User Profile:', profile);
      console.log('Required Permission:', permission);

      // Se a permissão for um array de UUIDs, verifique se o perfil está incluído
      if (isArray(permission)) {
        return permission.includes(profile);
      }
      // Se a permissão for um único UUID, faça uma comparação direta
      return permission === profile;
    }
  }
  return mixin(PermissionGuardMixin);
}
