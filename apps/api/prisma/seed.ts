import { PrismaClient, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'Test1234!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`⚠️  Usuario de prueba ya existe (${email}). Seed omitido.`);
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email,
      password: hash,
      tasks: {
        createMany: {
          data: [
            {
              title: 'Explorar el dashboard',
              description: 'Revisa las opciones de filtrado y paginación.',
              status: TaskStatus.pending,
            },
            {
              title: 'Crear una tarea nueva',
              description: 'Prueba el formulario de creación.',
              status: TaskStatus.pending,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            },
            {
              title: 'Marcar tarea como completada',
              description: 'Haz clic en el toggle de estado.',
              status: TaskStatus.done,
            },
          ],
        },
      },
    },
  });

  console.log(`✅ Usuario de prueba creado:`);
  console.log(`   Email   : ${user.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Tareas  : 3 (2 pendientes, 1 completada)`);
}

main()
  .catch((e) => {
    console.error('❌ Error al ejecutar el seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
