<?php get_header();?>
    <?php while(have_posts()){
        the_post(); 
        pageBanner();
        ?>
     
  
  <div class="container container--narrow page-section">
  <div class="metabox metabox--position-up metabox--with-home-link">
      <p><a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('program');  ?>"><i class="fa fa-home" aria-hidden="true"></i>All programs</a> <span class="metabox__main"><?php the_title() ?></span></p>
    </div>
      <div class="generic-content">
      <?php the_content() ?>
      </div>
      
      <?php
           $relatedProfessors = new WP_Query(array(
            'posts_per_page'=>-1,
            'post_type'=>'professor',
            'orderBy'=>'title',
            'order'=>'ASC',
            'meta_query'=>array(
               array(
                'key'=>'related_programs',
                'compare'=>'LIKE',
                'value'=>'"'.get_the_ID().'"'
              )
            ) 
           ));

           if($relatedProfessors->have_posts()){
             echo '<hr class="section-break">';  
           echo '<h2 class="headline headline--medium"> '.get_the_title().' Professors</h2>';  
           echo '<ul class="professor-cards">';
           while($relatedProfessors->have_posts()){
             $relatedProfessors->the_post(); ?>
                <li class="professor-card__list-item">
                  <a class="professor-card" href="<?php the_permalink() ?>">
                    <img class="professor-card__image" src="<?php the_post_thumbnail_url('professorLandscape');  ?>" alt="">
                    <span class="professor-card__name"><?php the_title(); ?></span>
                  </a>
                </li>
          <?php }
          echo '</ul>';
           }

          //fix possible erros 
          wp_reset_postdata(); 
               
            
            $relatedCampuses = get_field('related_campus');
            echo '<hr class="section-break">';
            if($relatedCampuses){
               echo '<h2 class="headline headline--medium">'. get_the_title() .' is available at this campuses</h2>'; 
               echo '<ul class="min-list link-list">';
               foreach($relatedCampuses as $campus){
                  ?><li><a href="<?php get_the_permalink($campus) ?>"><?php echo get_the_title($campus) ?></a></li> <?php
               }
               echo '</ul>';
            }
            
          ?>
  </div>

   <?php     
    }
    ?>
<?php get_footer();?>