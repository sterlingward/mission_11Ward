using BookStore.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;
        
        public BookController(BookDbContext temp) => _bookContext = temp;

        [HttpGet("AllBooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1)
        {
            var something =  _bookContext.Books
                        .Skip((pageNum - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
                        
            var totalNumBooks = _bookContext.Books.Count();
            
            var someObject = new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            };
            return Ok(someObject);
        }
        
        
    }
}
