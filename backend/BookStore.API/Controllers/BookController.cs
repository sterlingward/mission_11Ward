using BookStore.API.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace BookStore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        // Modified endpoint with optional category filter
        [HttpGet("AllBooks")]
        public IActionResult GetBooks(string? category = null, int pageSize = 5, int pageNum = 1)
        {
            var query = _bookContext.Books.AsQueryable();

            // Apply category filter if provided
            if (!string.IsNullOrEmpty(category) && category != "All")
            {
                query = query.Where(b => b.Category == category);
            }

            // Total books after filtering
            var totalNumBooks = query.Count();

            // Apply pagination
            var pagedBooks = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var response = new
            {
                Books = pagedBooks,
                TotalNumBooks = totalNumBooks
            };

            return Ok(response);
        }
    }
}