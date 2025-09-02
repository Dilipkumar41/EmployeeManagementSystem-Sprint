using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Data;

namespace EmployeeManagementSystem.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly EmployeeManagementDbContext _context;
        protected readonly DbSet<T> _db;

        public GenericRepository(EmployeeManagementDbContext context)
        {
            _context = context;
            _db = context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
            => await _db.AsNoTracking().ToListAsync();

        public virtual async Task<T?> GetByIdAsync(int id)
            => await _db.FindAsync(id);

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
            => await _db.AsNoTracking().Where(predicate).ToListAsync();

        public virtual async Task<T> AddAsync(T entity)
        {
            await _db.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            await _db.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _db.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await _db.FindAsync(id);
            if (entity is null) return; // nothing to delete
            _db.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(T entity)
        {
            _db.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();

        // ---------- EXPLICIT INTERFACE METHODS (only if your interface requires these signatures) ----------

        // If IGenericRepository<T>.UpdateAsync returns Task<T>, implement it like this:
        async Task<T> IGenericRepository<T>.UpdateAsync(T entity)
        {
            _db.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // If IGenericRepository<T>.DeleteAsync(int id) returns Task<T>, implement it like this:
        async Task<T> IGenericRepository<T>.DeleteAsync(int id)
        {
            var entity = await _db.FindAsync(id);
            if (entity is null) throw new KeyNotFoundException($"{typeof(T).Name} with id {id} not found.");
            _db.Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        // If your interface has SaveChangeAsync() (singular), forward to EF's SaveChangesAsync():
        Task<int> IGenericRepository<T>.SaveChangeAsync()
            => _context.SaveChangesAsync();
    }
}
