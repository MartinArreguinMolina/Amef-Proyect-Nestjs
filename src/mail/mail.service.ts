import { Injectable } from '@nestjs/common';
import { CreateMailDto } from './dto/create-mail.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService
  ) { }


  async sendActionAssignedEmail(
    dto: CreateMailDto,
  ) {
    const { to, amefId, typeAmef, amef, action, name, analysisId } = dto;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const normalizedType =
      typeAmef.charAt(0).toUpperCase() + typeAmef.slice(1).toLowerCase();

    await this.mailerService.sendMail({
      to,
      subject: `Tienes una acción asignada en el AMEF ${amef} 🚧`,
      html: `
      <div style="
        font-family: Arial, sans-serif;
        background-color: #f4f4f5;
        padding: 24px;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        ">
          <div style="
            background: linear-gradient(90deg, #153e75, #1f2933);
            color: #ffffff;
            padding: 20px 24px;
          ">
            <h1 style="margin: 0; font-size: 20px;">
              AMEF Automotriz
            </h1>
            <p style="margin: 4px 0 0; font-size: 14px; opacity: .9;">
              Gestión de riesgos de diseño y proceso
            </p>
          </div>

          <div style="padding: 24px;">
            <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
              ${formattedDate}
            </p>

            <h2 style="margin-top: 0; color: #111827; font-size: 18px;">
              Hola, ${name} 👋
            </h2>

            <p style="margin: 0 0 12px; color: #4b5563; font-size: 14px; line-height: 1.6;">
              Tienes una nueva acción asignada dentro del AMEF de ${normalizedType.toLowerCase()}
              <strong>“${amef}”</strong>, con el identificador <strong>#${amefId}</strong>.
            </p>

            <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
              Esta acción forma parte del seguimiento a los riesgos detectados y es importante
              para asegurar la calidad y confiabilidad del producto. A continuación verás un resumen
              de lo que se espera de ti.
            </p>

            <div style="
              background-color: #f3f4f6;
              border-radius: 10px;
              padding: 14px 16px;
              margin-bottom: 18px;
              border: 1px solid #e5e7eb;
              font-size: 14px;
              color: #374151;
            ">
              <p style="margin: 0 0 6px;">
                <strong>Tipo de AMEF:</strong> ${normalizedType}
              </p>
              <p style="margin: 0 0 6px;">
                <strong>Nombre del ${normalizedType.toLowerCase()}:</strong> ${amef}
              </p>
              <p style="margin: 0 0 6px;">
                <strong>ID de AMEF:</strong> #${amefId}
              </p>
              ${analysisId
          ? `
              <p style="margin: 0 0 6px;">
                <strong>ID de análisis:</strong> #${analysisId}
              </p>
              `
          : ''
        }
              <p style="margin: 0 0 6px;">
                <strong>Persona responsable:</strong> ${name}
              </p>
              <p style="margin: 0 0 6px;">
                <strong>Acción asignada:</strong> ${action}
              </p>
              <p style="margin: 0;">
                <strong>Fecha de asignación:</strong> ${formattedDate}
              </p>
            </div>

            <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
              Te invitamos a ingresar a la plataforma, revisar el contexto del AMEF y actualizar
              el estatus de tu acción conforme avances. Mantener la información actualizada ayuda
              a que todo el equipo tenga visibilidad y pueda tomar decisiones a tiempo.
            </p>

            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
              Si consideras que esta asignación no te corresponde o fue realizada por error,
              por favor contacta al responsable de calidad o al administrador del sistema para
              revisar la información.
            </p>
          </div>

          <div style="
            padding: 16px 24px;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
          ">
            © ${new Date().getFullYear()} AMEF Automotriz. Todos los derechos reservados.
          </div>
        </div>
      </div>
    `,
    });
  }

}
