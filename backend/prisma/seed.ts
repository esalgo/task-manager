import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client.js';

const adapter = new PrismaLibSql({ url: process.env['DATABASE_URL'] ?? 'file:./data/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const usersData = [
    { name: 'Juan',           email: 'juan12@mail.com',   password: 'Juan123!',  rol: 'Usuario'        as const },
    { name: 'admin',          email: 'admin@mail.com',    password: 'Admin123!', rol: 'Administrador'  as const },
    { name: 'Antonio',        email: 'antonio@mail.com',  password: 'Anto123!',  rol: 'Administrador'  as const },
    { name: 'Alberto Carlos', email: 'alberto@mail.com',  password: 'Zxcv123*', rol: 'Usuario'        as const },
  ];

  const createdUsers = await Promise.all(
    usersData.map(async (u) => {
      const password = await bcrypt.hash(u.password, 10);
      return prisma.user.create({ data: { name: u.name, email: u.email, password, rol: u.rol } });
    })
  );

  const [juan, , , ] = createdUsers;
  const admin = createdUsers[1];

  await prisma.task.createMany({
    data: [
      {
        title: 'Pagar las facturas',
        category: 'Casa',
        date: '2026-02-06',
        priority: 'Alta',
        status: 'Progreso',
        description: 'Pagar las facturas del celular',
        userId: juan.id,
      },
      {
        title: 'Tarea admin',
        category: 'Administrador de tareas',
        date: '2026-02-08',
        priority: 'Media',
        status: 'Completada',
        description: 'Revisar los usuarios registrados',
        userId: admin.id,
      },
      {
        title: 'Estudiar',
        category: 'Estudio',
        date: '2026-02-06',
        priority: 'Baja',
        status: 'Pendiente',
        description: 'Estudiar para el examen',
        userId: admin.id,
      },
    ],
  });

  console.log('Seed completado: 4 usuarios, 3 tareas.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
