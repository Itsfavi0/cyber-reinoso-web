// Consultas copiadas de conexion.py (DBManager). Solo se recortó la indentación.

export const SQL_SNIPPETS = [
  {
    id: 'toggle',
    tab: 'Toggle de estado',
    source: 'alternar_estado_estacion()',
    why: 'La alternancia se decide dentro del motor con CASE WHEN: un solo viaje a la base de datos y sin condiciones de carrera entre dos cajas.',
    code: `UPDATE Estaciones
SET estado = CASE WHEN estado = 1 THEN 0 ELSE 1 END,
    id_estado = CASE WHEN estado = 1
                    THEN (SELECT id_estado FROM EstadosEstacion WHERE nombre_estado = 'Mantenimiento')
                    ELSE (SELECT id_estado FROM EstadosEstacion WHERE nombre_estado = 'Disponible')
                END
WHERE codigo_pc = ?`,
  },
  {
    id: 'login',
    tab: 'Login estricto',
    source: 'validar_login()',
    why: 'SQL Server compara texto sin distinguir mayúsculas por defecto. La intercalación _CS_AS hace que ADMIN no abra la cuenta admin.',
    code: `SELECT e.id_empleado, e.nombre, r.nombre_rol
FROM Empleados e
INNER JOIN Roles r ON e.id_rol = r.id_rol
WHERE e.usuario COLLATE Latin1_General_CS_AS = ?
  AND e.clave COLLATE Latin1_General_CS_AS = ?`,
  },
  {
    id: 'sale',
    tab: 'Venta atómica',
    source: 'procesar_compra_kiosco()',
    why: 'Saldo, cabecera, detalle y stock se escriben en una sola transacción. Si cualquier sentencia falla, conn.rollback() deshace todo.',
    code: `-- 1. Descontar la billetera
UPDATE Usuarios SET saldo_billetera = saldo_billetera - ? WHERE id_usuario = ?

-- 2. Cabecera de la boleta, devolviendo su id
INSERT INTO Ventas (id_usuario, id_empleado, monto_total)
OUTPUT INSERTED.id_venta
VALUES (?, ?, ?)

-- 3. Por cada producto del carrito: detalle y stock
INSERT INTO DetalleVentas (id_venta, id_producto, cantidad, precio_unitario, subtotal)
VALUES (?, ?, ?, ?, ?)
UPDATE Productos SET stock = stock - ? WHERE id_producto = ?

-- 4. conn.commit(), o conn.rollback() si algo falló`,
  },
]
