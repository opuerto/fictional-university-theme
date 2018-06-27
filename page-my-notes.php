<?php get_header();?>

<?php while(have_posts()) {
    the_post(); 
    //call the function page banner that we created on the functions.php file 
    pageBanner();  
    ?>
  <div class="container container--narrow page-section">
   Custom Code will go here

  </div>   
    
<?php } ?>


<?php get_footer();?>

<li class="current_page_item"><a href="#">Our History</a></li>
        <li><a href="#">Our Goals</a></li>