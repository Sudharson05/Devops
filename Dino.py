import pygame
import random

pygame.init()

# Screen
WIDTH, HEIGHT = 800, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Dino Game")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Dino settings
dino_x = 50
dino_y = 300
dino_width = 40
dino_height = 60
jump = False
velocity = 0
gravity = 1

# Obstacle settings
obstacle_x = WIDTH
obstacle_y = 320
obstacle_width = 40
obstacle_height = 50
speed = 6

clock = pygame.time.Clock()

running = True
while running:
    screen.fill(WHITE)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        # Jump
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and not jump:
                jump = True
                velocity = -15

    # Dino physics
    if jump:
        dino_y += velocity
        velocity += gravity
        if dino_y >= 300:
            dino_y = 300
            jump = False

    # Move obstacle
    obstacle_x -= speed
    if obstacle_x < -obstacle_width:
        obstacle_x = WIDTH
        speed += 0.5  # speed increase

    # Draw dino
    pygame.draw.rect(screen, BLACK, (dino_x, dino_y, dino_width, dino_height))

    # Draw obstacle
    pygame.draw.rect(screen, BLACK, (obstacle_x, obstacle_y, obstacle_width, obstacle_height))

    # Collision detection
    dino_rect = pygame.Rect(dino_x, dino_y, dino_width, dino_height)
    obstacle_rect = pygame.Rect(obstacle_x, obstacle_y, obstacle_width, obstacle_height)

    if dino_rect.colliderect(obstacle_rect):
        font = pygame.font.SysFont(None, 55)
        text = font.render("Game Over!", True, BLACK)
        screen.blit(text, (WIDTH//2 - 100, HEIGHT//2))
        pygame.display.update()
        pygame.time.delay(2000)
        running = False

    pygame.display.update()
    clock.tick(30)

pygame.quit()
