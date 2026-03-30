using IsikAvukatlik.API.Models;
using Microsoft.EntityFrameworkCore;

namespace IsikAvukatlik.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Article> Articles => Set<Article>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<User> Users => Set<User>();
    public DbSet<CaseFile> CaseFiles => Set<CaseFile>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Article
        modelBuilder.Entity<Article>(entity =>
        {
            entity.HasIndex(a => a.Slug).IsUnique();
            entity.HasOne(a => a.Category)
                  .WithMany(c => c.Articles)
                  .HasForeignKey(a => a.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
        });

        // Seed: Varsayılan kategoriler
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Ceza Hukuku", Slug = "ceza-hukuku", Description = "Ceza davalarına ilişkin hukuki yazılar" },
            new Category { Id = 2, Name = "Aile Hukuku", Slug = "aile-hukuku", Description = "Aile hukuku alanındaki bilgilendirmeler" },
            new Category { Id = 3, Name = "Ticaret Hukuku", Slug = "ticaret-hukuku", Description = "Ticari uyuşmazlıklar ve şirketler hukuku" },
            new Category { Id = 4, Name = "İş Hukuku", Slug = "is-hukuku", Description = "İşçi-işveren ilişkileri ve iş hukuku" },
            new Category { Id = 5, Name = "İdare Hukuku", Slug = "idare-hukuku", Description = "İdari yargı ve kamu hukuku meseleleri" }
        );
    }
}
