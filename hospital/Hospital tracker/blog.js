// Search functionality for blog posts
document.getElementById('search').addEventListener('keyup', function () {
    let query = this.value.toLowerCase();
    let posts = document.querySelectorAll('.post');
  
    posts.forEach(post => {
      let title = post.querySelector('h3').innerText.toLowerCase();
      let content = post.querySelector('p').innerText.toLowerCase();
  
      if (title.includes(query) || content.includes(query)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  });
  