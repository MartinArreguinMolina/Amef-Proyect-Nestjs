import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";


export class HandleErrors {
    static handleDBErrors(error: any): never {

    if (error instanceof EntityNotFoundError) {
      throw new NotFoundException('No se encontró la entidad solicitada');
    }

    switch (error.code) {
      case '23505': // unique_violation
        throw new ConflictException(error.detail);

      case '23503': // foreign_key_violation
        throw new BadRequestException('Violación de llave foránea: ' + error.detail);

      case '23502': // not_null_violation
        throw new BadRequestException('Campo requerido no puede ser nulo: ' + error.column);

      case '22P02': // invalid_text_representation (ej: UUID mal formado)
        throw new BadRequestException('Formato de identificador inválido');

      case '42703': // undefined_column
        throw new BadRequestException('Columna no existe en la consulta');

      default:
        throw new InternalServerErrorException('Error inesperado, revisa los logs');
    }
  }
}